import React, { createContext, useContext, useState, useEffect } from 'react';
import SQLAgent from '../agents/SQLAgent';

const AgentContext = createContext(null);

export const AgentProvider = ({ children }) => {
  const [agent, setAgent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    initializeAgent();
  }, []);

  const initializeAgent = async () => {
    try {
      const sqlAgent = new SQLAgent();
      await sqlAgent.initialize();
      setAgent(sqlAgent);
      setLoading(false);
    } catch (err) {
      console.error('Failed to initialize agent:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  const processQuery = async (query) => {
    if (!agent) {
      throw new Error('Agent not initialized');
    }
    return await agent.processQuery(query);
  };

  const initializeWithSchema = async (schema) => {
    if (!agent) {
      throw new Error('Agent not initialized');
    }
    return await agent.initializeWithSchema(schema);
  };

  const value = {
    agent,
    loading,
    error,
    processQuery,
    initializeWithSchema
  };

  return (
    <AgentContext.Provider value={value}>
      {children}
    </AgentContext.Provider>
  );
};

export const useAgent = () => {
  const context = useContext(AgentContext);
  if (!context) {
    throw new Error('useAgent must be used within an AgentProvider');
  }
  return context;
}; 