-- Função para criar a tabela mmgp_responses
CREATE OR REPLACE FUNCTION create_mmgp_table()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Verificar se a tabela já existe
  IF NOT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'mmgp_responses'
  ) THEN
    -- Criar a tabela
    CREATE TABLE public.mmgp_responses (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      email TEXT NOT NULL,
      classification JSONB,
      level2 JSONB,
      level3 JSONB,
      level4 JSONB,
      level5 JSONB,
      submitted_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
      user_id UUID REFERENCES auth.users(id),
      maturity_index DECIMAL(5,2),
      level2_score DECIMAL(5,2),
      level3_score DECIMAL(5,2),
      level4_score DECIMAL(5,2),
      level5_score DECIMAL(5,2),
      estado VARCHAR(2)
    );
    
    -- Criar índices
    CREATE INDEX idx_mmgp_responses_email ON public.mmgp_responses(email);
    CREATE INDEX idx_mmgp_responses_submitted_at ON public.mmgp_responses(submitted_at);
    CREATE INDEX idx_mmgp_responses_user_id ON public.mmgp_responses(user_id);
    CREATE INDEX idx_mmgp_responses_maturity_index ON public.mmgp_responses(maturity_index);
    CREATE INDEX idx_mmgp_responses_estado ON public.mmgp_responses(estado);
  END IF;
END;
$$;

-- Função para configurar as políticas RLS
CREATE OR REPLACE FUNCTION setup_mmgp_rls()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Habilitar RLS na tabela
  ALTER TABLE public.mmgp_responses ENABLE ROW LEVEL SECURITY;
  
  -- Remover políticas existentes
  DROP POLICY IF EXISTS "Permitir inserção para todos" ON public.mmgp_responses;
  DROP POLICY IF EXISTS "Permitir seleção para todos" ON public.mmgp_responses;
  DROP POLICY IF EXISTS "Usuários podem atualizar seus próprios registros" ON public.mmgp_responses;
  DROP POLICY IF EXISTS "Usuários podem excluir seus próprios registros" ON public.mmgp_responses;
  
  -- Criar novas políticas
  CREATE POLICY "Permitir inserção para todos" 
  ON public.mmgp_responses FOR INSERT 
  TO public
  WITH CHECK (true);
  
  CREATE POLICY "Permitir seleção para todos" 
  ON public.mmgp_responses FOR SELECT 
  TO public
  USING (true);
  
  CREATE POLICY "Usuários podem atualizar seus próprios registros" 
  ON public.mmgp_responses FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = user_id OR email = auth.email());
  
  CREATE POLICY "Usuários podem excluir seus próprios registros" 
  ON public.mmgp_responses FOR DELETE 
  TO authenticated 
  USING (auth.uid() = user_id OR email = auth.email());
END;
$$;
