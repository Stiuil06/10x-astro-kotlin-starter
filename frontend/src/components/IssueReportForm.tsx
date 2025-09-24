import React, { useState } from 'react';

interface IssueFormData {
  title: string;
  description: string;
  category: string;
  priority: string;
  location: string;
  contactEmail: string;
  contactPhone: string;
  photos: File[];
}

const IssueReportForm: React.FC = () => {
  const [formData, setFormData] = useState<IssueFormData>({
    title: '',
    description: '',
    category: '',
    priority: 'medium',
    location: '',
    contactEmail: '',
    contactPhone: '',
    photos: []
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const categories = [
    'Awaria hydrauliczna',
    'Awaria elektryczna',
    'Uszkodzenie windy',
    'Problemy z ogrzewaniem',
    'Uszkodzenie dachu',
    'Problemy z wentylacją',
    'Uszkodzenie drzwi/okien',
    'Problemy z parkingiem',
    'Inne'
  ];

  const priorities = [
    { value: 'low', label: 'Niski' },
    { value: 'medium', label: 'Średni' },
    { value: 'high', label: 'Wysoki' },
    { value: 'urgent', label: 'Pilny' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setFormData(prev => ({
        ...prev,
        photos: [...prev.photos, ...files]
      }));
    }
  };

  const removePhoto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Mock submission - w rzeczywistej aplikacji tutaj byłby API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Zgłoszenie zostało wysłane!</h2>
          <p className="text-gray-600 mb-6">
            Dziękujemy za zgłoszenie. Nasz zespół skontaktuje się z Tobą w ciągu 24 godzin.
          </p>
          <button
            onClick={() => {
              setIsSubmitted(false);
              setFormData({
                title: '',
                description: '',
                category: '',
                priority: 'medium',
                location: '',
                contactEmail: '',
                contactPhone: '',
                photos: []
              });
            }}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Zgłoś kolejny problem
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Zgłoś problem</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Tytuł zgłoszenia *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Krótki opis problemu"
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
            Kategoria *
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Wybierz kategorię</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
            Priorytet
          </label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {priorities.map(priority => (
              <option key={priority.value} value={priority.value}>{priority.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
            Lokalizacja problemu *
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="np. Klatka schodowa, piętro 2, mieszkanie 15"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Opis problemu *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Szczegółowy opis problemu..."
          />
        </div>

        <div>
          <label htmlFor="photos" className="block text-sm font-medium text-gray-700 mb-2">
            Zdjęcia (opcjonalnie)
          </label>
          <input
            type="file"
            id="photos"
            name="photos"
            multiple
            accept="image/*"
            onChange={handlePhotoChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {formData.photos.length > 0 && (
            <div className="mt-2">
              <p className="text-sm text-gray-600 mb-2">Wybrane zdjęcia:</p>
              <div className="flex flex-wrap gap-2">
                {formData.photos.map((photo, index) => (
                  <div key={index} className="flex items-center bg-gray-100 rounded-lg px-3 py-1">
                    <span className="text-sm text-gray-700">{photo.name}</span>
                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-2">
              Email kontaktowy *
            </label>
            <input
              type="email"
              id="contactEmail"
              name="contactEmail"
              value={formData.contactEmail}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="twoj@email.com"
            />
          </div>

          <div>
            <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 mb-2">
              Telefon kontaktowy
            </label>
            <input
              type="tel"
              id="contactPhone"
              name="contactPhone"
              value={formData.contactPhone}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="+48 123 456 789"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Wysyłanie...' : 'Wyślij zgłoszenie'}
        </button>
      </form>
    </div>
  );
};

export default IssueReportForm;
