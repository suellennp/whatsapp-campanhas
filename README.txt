### INSTRUÇÕES DE USO LOCAL ###

1. Instale dependências do backend:
   cd whatsapp-campanhas/backend
   pip install -r ../requirements.txt

2. Execute o backend:
   python app.py

3. Configure o frontend:
   cd ../frontend
   Instale as dependências com: npm install
   Inicie com: npx serve (ou usar react-scripts)

4. Backend: http://localhost:5000
   Frontend: http://localhost:3000 (via npm)

OBS: execute GET /api/setup no backend uma vez para criar a base de dados SQLite.
