from flask import Flask, jsonify, request
from flask_cors import CORS
import sqlite3
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app)

DATABASE = 'vacinas.db'

def get_db_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

@app.route('/api/setup', methods=['GET'])
def setup():
    conn = get_db_connection()
    conn.execute("""
        CREATE TABLE IF NOT EXISTS vacinas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome_cliente TEXT NOT NULL,
            telefone TEXT NOT NULL,
            data_aplicacao TEXT NOT NULL,
            data_vencimento TEXT NOT NULL
        );
    """)
    conn.commit()
    conn.close()
    return jsonify({'message': 'Tabela criada com sucesso.'})

@app.route('/api/compras', methods=['POST'])
def nova_compra():
    data = request.json
    conn = get_db_connection()
    conn.execute("""
        INSERT INTO vacinas (nome_cliente, telefone, data_aplicacao, data_vencimento)
        VALUES (?, ?, ?, ?)
    """, (
        data['nome_cliente'],
        data['telefone'],
        data['data_aplicacao'],
        data['data_vencimento']
    ))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Compra registrada com sucesso.'})

@app.route('/api/clientes', methods=['GET'])
def listar_clientes():
    conn = get_db_connection()
    clientes = conn.execute('SELECT * FROM vacinas').fetchall()
    conn.close()
    return jsonify([dict(row) for row in clientes])

@app.route('/api/clientes/report', methods=['GET'])
def relatorio():
    hoje = datetime.now()
    data_limite = hoje - timedelta(days=365)
    conn = get_db_connection()
    resultado = conn.execute("""
        SELECT * FROM vacinas
        WHERE data_aplicacao >= ?
    """, (data_limite.strftime('%Y-%m-%d'),)).fetchall()
    conn.close()
    return jsonify([dict(row) for row in resultado])

@app.route('/api/whatsapp/send', methods=['POST'])
def enviar_whatsapp():
    data = request.json
    return jsonify({
        'message': f"Mensagem enviada para {data['telefone']} com sucesso.",
        'conteudo': data['mensagem']
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
