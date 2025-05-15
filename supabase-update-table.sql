-- Adicionar colunas para armazenar os resultados calculados
ALTER TABLE public.mmgp_responses 
ADD COLUMN IF NOT EXISTS maturity_index DECIMAL(5,2),
ADD COLUMN IF NOT EXISTS level2_score DECIMAL(5,2),
ADD COLUMN IF NOT EXISTS level3_score DECIMAL(5,2),
ADD COLUMN IF NOT EXISTS level4_score DECIMAL(5,2),
ADD COLUMN IF NOT EXISTS level5_score DECIMAL(5,2),
ADD COLUMN IF NOT EXISTS estado VARCHAR(2);

-- Atualizar as políticas RLS para permitir acesso aos novos campos
DROP POLICY IF EXISTS "Permitir inserção para todos" ON public.mmgp_responses;
DROP POLICY IF EXISTS "Permitir seleção para todos" ON public.mmgp_responses;

-- Política para permitir que qualquer pessoa insira registros
CREATE POLICY "Permitir inserção para todos" 
ON public.mmgp_responses FOR INSERT 
TO public
WITH CHECK (true);

-- Política para permitir que qualquer pessoa veja registros
CREATE POLICY "Permitir seleção para todos" 
ON public.mmgp_responses FOR SELECT 
TO public
USING (true);

-- Criar índices para melhorar a performance das consultas
CREATE INDEX IF NOT EXISTS idx_mmgp_responses_email ON public.mmgp_responses(email);
CREATE INDEX IF NOT EXISTS idx_mmgp_responses_submitted_at ON public.mmgp_responses(submitted_at);
CREATE INDEX IF NOT EXISTS idx_mmgp_responses_maturity_index ON public.mmgp_responses(maturity_index);
CREATE INDEX IF NOT EXISTS idx_mmgp_responses_estado ON public.mmgp_responses(estado);
