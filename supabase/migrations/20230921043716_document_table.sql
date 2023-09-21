-- https://supabase.com/docs/guides/ai/langchain
-- https://supabase.com/blog/openai-embeddings-postgres-vector

-- Enable the pgvector extension to work with embedding vectors
CREATE EXTENSION IF NOT EXISTS vector;

-- Create a table to store your documents
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  knowledge_id UUID,
  content TEXT, 
  embedding VECTOR(1536) -- 1536 works for OpenAI embeddings, change if needed
);

-- Add a HNSW index for the inner product distance function
CREATE INDEX ON documents
USING hnsw (embedding vector_ip_ops);


-- Create a table to store knowledge entries
CREATE TABLE knowledges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID,
  title VARCHAR,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create or replace a function to match documents with knowledge references
CREATE OR REPLACE FUNCTION match_documents (
  knowledge_id UUID,
  query_embedding VECTOR(1536),
  match_threshold FLOAT,
  match_count INT
)
RETURNS TABLE (
  id UUID,
  knowledge_id UUID,
  content TEXT,
  similarity FLOAT
)
LANGUAGE SQL STABLE
AS $$
  SELECT
    documents.id,
    documents.knowledge_id,
    documents.content,
    1 - (documents.embedding <=> query_embedding) AS similarity
  FROM documents
  WHERE documents.knowledge_id = knowledge_id
  AND 1 - (documents.embedding <=> query_embedding) > match_threshold
  ORDER BY similarity DESC
  LIMIT match_count;
$$;
