import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function App() {
  const [clientes, setClientes] = useState([]);
  const [form, setForm] = useState({
    nome_cliente: '',
    telefone: '',
    data_aplicacao: '',
    data_vencimento: ''
  });

  useEffect(() => {
    fetchClientes();
  }, []);

  const fetchClientes = async () => {
    const res = await axios.get('http://localhost:5000/api/clientes/report');
    setClientes(res.data);
  };

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:5000/api/compras', form);
    setForm({ nome_cliente: '', telefone: '', data_aplicacao: '', data_vencimento: '' });
    fetchClientes();
  };

  const enviarMensagem = async (cliente) => {
    const mensagem = `Olá ${cliente.nome_cliente}, sua vacina venceu em ${cliente.data_vencimento}. Agende seu reforço!`;
    await axios.post('http://localhost:5000/api/whatsapp/send', {
      telefone: cliente.telefone,
      mensagem: mensagem
    });
    alert('Mensagem enviada!');
  };

  return (
    <div>
      <h1>Relatório de Vacinas</h1>
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Telefone</th>
            <th>Aplicação</th>
            <th>Vencimento</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map((cliente, index) => (
            <tr key={index}>
              <td>{cliente.nome_cliente}</td>
              <td>{cliente.telefone}</td>
              <td>{cliente.data_aplicacao}</td>
              <td>{cliente.data_vencimento}</td>
              <td>
                <button onClick={() => enviarMensagem(cliente)}>Enviar WhatsApp</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Nova Compra</h2>
      <form onSubmit={handleSubmit}>
        <input name="nome_cliente" value={form.nome_cliente} onChange={handleInputChange} placeholder="Nome" />
        <input name="telefone" value={form.telefone} onChange={handleInputChange} placeholder="Telefone" />
        <input name="data_aplicacao" type="date" value={form.data_aplicacao} onChange={handleInputChange} />
        <input name="data_vencimento" type="date" value={form.data_vencimento} onChange={handleInputChange} />
        <button type="submit">Cadastrar</button>
      </form>
    </div>
  );
}
