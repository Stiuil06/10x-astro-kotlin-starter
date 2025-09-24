import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { DefaultApi, Configuration } from '../lib/generated';
import type { Decision, DecisionLogResponse, DecisionStatusEnum } from '../lib/generated';

const DecisionsLog: React.FC = () => {
  const { token } = useAuth();
  const [sortBy, setSortBy] = useState<'date' | 'category' | 'status'>('date');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  
  // API state
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    totalElements: 0,
    totalPages: 0,
    number: 0,
    first: true,
    last: true,
    numberOfElements: 0
  });

  // API configuration
  const apiConfig = new Configuration({
    basePath: 'http://localhost:8080',
    accessToken: token || undefined,
  });
  const api = new DefaultApi(apiConfig);

  const categories = ['all', 'Remonty', 'Infrastruktura', 'Finanse', 'Bezpieczeństwo', 'Regulamin'];
  const statuses = ['all', 'active', 'completed', 'cancelled'];

  // Fetch decisions from API
  const fetchDecisions = async () => {
    if (!token) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.getDecisionLog({
        page: currentPage,
        size: pageSize,
        sort: sortBy,
        category: filterCategory === 'all' ? undefined : filterCategory,
        status: filterStatus === 'all' ? undefined : filterStatus as any
      });
      
      setDecisions(response.content);
      setPagination({
        totalElements: response.totalElements,
        totalPages: response.totalPages,
        number: response.number,
        first: response.first,
        last: response.last,
        numberOfElements: response.numberOfElements
      });
    } catch (err) {
      console.error('Error fetching decisions:', err);
      setError('Wystąpił błąd podczas pobierania decyzji. Spróbuj ponownie.');
    } finally {
      setLoading(false);
    }
  };

  // Load decisions when filters change
  useEffect(() => {
    fetchDecisions();
  }, [currentPage, sortBy, filterCategory, filterStatus, token]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(0);
  }, [sortBy, filterCategory, filterStatus]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Aktywna';
      case 'completed': return 'Zakończona';
      case 'cancelled': return 'Anulowana';
      default: return status;
    }
  };

  // Pagination component
  const PaginationComponent = () => {
    const pages = [];
    const maxVisiblePages = 5;
    const startPage = Math.max(0, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(pagination.totalPages - 1, startPage + maxVisiblePages - 1);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`px-3 py-2 text-sm font-medium rounded-lg ${
            i === currentPage
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
          }`}
        >
          {i + 1}
        </button>
      );
    }

    return (
      <div className="flex items-center justify-between mt-8">
        <div className="text-sm text-gray-700">
          Pokazano {pagination.numberOfElements} z {pagination.totalElements} decyzji
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentPage(0)}
            disabled={pagination.first}
            className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Pierwsza
          </button>
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={pagination.first}
            className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Poprzednia
          </button>
          {pages}
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={pagination.last}
            className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Następna
          </button>
          <button
            onClick={() => setCurrentPage(pagination.totalPages - 1)}
            disabled={pagination.last}
            className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Ostatnia
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Log decyzji wspólnoty</h2>
        <p className="text-gray-600">Przeglądaj ważne decyzje podjęte przez zarząd wspólnoty mieszkaniowej</p>
      </div>

      {/* Filtry i sortowanie */}
      <div className="mb-8 bg-gray-50 rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sortuj według</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'category' | 'status')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="date">Data</option>
              <option value="category">Kategoria</option>
              <option value="status">Status</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Kategoria</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'Wszystkie kategorie' : category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {statuses.map(status => (
                <option key={status} value={status}>
                  {status === 'all' ? 'Wszystkie statusy' : getStatusLabel(status)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="text-center py-12">
          <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-white bg-blue-500 hover:bg-blue-400 transition ease-in-out duration-150 cursor-not-allowed">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Ładowanie decyzji...
          </div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="text-center py-12">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
            <button
              onClick={fetchDecisions}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Spróbuj ponownie
            </button>
          </div>
        </div>
      )}

      {/* Lista decyzji */}
      {!loading && !error && (
        <div className="space-y-6">
          {decisions.map((decision) => (
          <div key={decision.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{decision.title}</h3>
                <p className="text-gray-600 mb-4">{decision.description}</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 lg:ml-6">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(decision.status)}`}>
                  {getStatusLabel(decision.status)}
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                  {decision.category}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Data decyzji</p>
                <p className="font-medium">{new Date(decision.date).toLocaleDateString('pl-PL')}</p>
                {decision.approvalDate && (
                  <p className="text-sm text-gray-500 mt-1">
                    Zatwierdzona: {new Date(decision.approvalDate).toLocaleDateString('pl-PL')}
                  </p>
                )}
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Wyniki głosowania</p>
                <div className="flex gap-4 text-sm">
                  <span className="text-green-600">Za: {decision.votes.votesFor}</span>
                  <span className="text-red-600">Przeciw: {decision.votes.against}</span>
                  <span className="text-gray-600">Wstrzymanie: {decision.votes.abstain}</span>
                </div>
              </div>
            </div>

            {decision.documents && decision.documents.length > 0 && (
              <div>
                <p className="text-sm text-gray-500 mb-2">Dokumenty:</p>
                <div className="flex flex-wrap gap-2">
                  {decision.documents.map((doc, index) => (
                    <a
                      key={index}
                      href="#"
                      className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-lg text-sm hover:bg-blue-200 transition-colors"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                      </svg>
                      {doc}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && decisions.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Brak decyzji spełniających wybrane kryteria</p>
        </div>
      )}

      {/* Pagination */}
      {!loading && !error && pagination.totalPages > 1 && <PaginationComponent />}
    </div>
  );
};

export default DecisionsLog;
