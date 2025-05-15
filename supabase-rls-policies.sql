-- Habilitar RLS na tabela mmgp_responses
ALTER TABLE public.mmgp_responses ENABLE ROW LEVEL SECURITY;

-- Adicionar coluna user_id se não existir
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'mmgp_responses' 
        AND column_name = 'user_id'
    ) THEN
        ALTER TABLE public.mmgp_responses ADD COLUMN user_id UUID REFERENCES auth.users(id);
    END IF;
END
$$;

-- Remover políticas existentes
DROP POLICY IF EXISTS "Usuários podem inserir seus próprios registros" ON public.mmgp_responses;
DROP POLICY IF EXISTS "Usuários podem ver seus próprios registros" ON public.mmgp_responses;
DROP POLICY IF EXISTS "Usuários podem atualizar seus próprios registros" ON public.mmgp_responses;
DROP POLICY IF EXISTS "Usuários podem excluir seus próprios registros" ON public.mmgp_responses;
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

-- Política para permitir que usuários autenticados atualizem seus próprios registros
CREATE POLICY "Usuários podem atualizar seus próprios registros" 
ON public.mmgp_responses FOR UPDATE 
TO authenticated 
USING (auth.uid() = user_id);

-- Política para permitir que usuários autenticados excluam seus próprios registros
CREATE POLICY "Usuários podem excluir seus próprios registros" 
ON public.mmgp_responses FOR DELETE 
TO authenticated 
USING (auth.uid() = user_id);
