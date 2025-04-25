#!/bin/bash

echo "==== CONFIGURANDO BACKEND ===="
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r ../requirements.txt
python app.py &
BACKEND_PID=$!
cd ..

echo "==== CONFIGURANDO FRONTEND ===="
cd frontend
npm install
npx serve &
FRONTEND_PID=$!
cd ..

echo "==== SERVIÇOS INICIADOS ===="
echo "Backend rodando em http://localhost:5000"
echo "Frontend rodando em http://localhost:3000"
echo "Para encerrar, use os comandos:"
echo "kill $BACKEND_PID"
echo "kill $FRONTEND_PID"
