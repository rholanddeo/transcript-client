import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import Modal from './component/Modal';

interface Podcast {
  id_podcast: string;
  Title: string;
  URL: string;
  Artist: string;
  Views: string;
  Duration: string;
  Likes: string;
  'Publish Date': string;
  Description: string;
}

function App() {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [transcripts, setTranscripts] = useState<{ [key: string]: string }>({});
  const [selectedPodcast, setSelectedPodcast] = useState<Podcast | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Load CSV data from public folder
  useEffect(() => {
    fetch('http://localhost:3000/podcasts')
      .then((response) => response.json())
      .then((data) => {
        setPodcasts(data);
      })
      .catch((error) => console.error('Error fetching podcasts:', error));
  }, []);

  // Open the modal for a specific podcast
  const openModal = (podcast: Podcast) => {
    setSelectedPodcast(podcast);
    setIsModalOpen(true);
  };

  // Close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPodcast(null);
  };

  // Save transcript and close modal
  const saveTranscript = () => {
    // Merge podcast data with transcripts
    const updatedData = podcasts.map((podcast) => ({
      ...podcast,
      Transcript: transcripts[podcast.id_podcast] || '',
    }));
  
    // Send updated data to the server
    fetch('http://localhost:3000/update-transcripts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ updatedPodcasts: updatedData }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Successfully updated CSV on the server:', data);
      })
      .catch((error) => console.error('Error updating CSV:', error));
  };
  

  // Download the updated CSV file
  const downloadCSV = () => {
    // Merge podcast data with transcripts
    const updatedData = podcasts.map((podcast) => ({
      ...podcast,
      Transcript: transcripts[podcast.id_podcast] || '',
    }));

    // Convert the updated data to CSV
    const csv = Papa.unparse(updatedData, {
      delimiter: ';',
      header: true,
    });

    // Create a blob and download the file
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'updated_podcast_transcripts.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };
  
  const filteredPodcasts = podcasts.filter((podcast) =>
    podcast.Title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="container mx-auto">
        <div className='flex justify-between items-center mb-6'>
          <h1 className="text-2xl font-bold">Podcast Transcript Manager</h1>
          <div className="flex gap-2">
            <input
              type="search"
              placeholder="Search by title..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="border rounded px-4 py-2 w-full"
            />
          <button
            onClick={downloadCSV}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded text-nowrap"
          >
            Download Updated CSV
          </button>
          </div>
        </div>


        {filteredPodcasts.length === 0 ? (
          <p>Loading podcast data...</p>
        ) : (
          <table className="table-auto w-full bg-white shadow-lg rounded-lg">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="p-4">Title</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPodcasts.map((podcast) => (
                <tr key={podcast.id_podcast} className="border-t">
                  <td className="p-4">
                    <a
                      href={podcast.URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      {podcast.Title}
                    </a>
                  </td>
                  <td className="p-4">
                    {transcripts[podcast.id_podcast] ? (
                      <span className="text-green-500 text-nowrap">Transcript added</span>
                    ) : (
                      <span className="text-red-500 text-nowrap">No transcript</span>
                    )}
                  </td>
                  <td className="p-4">
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded text-nowrap"
                      onClick={() => openModal(podcast)}
                    >
                      Add Transcript
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal Component */}
      <Modal
        show={isModalOpen}
        onClose={closeModal}
        onSave={saveTranscript}
        initialTranscript={selectedPodcast ? transcripts[selectedPodcast.id_podcast] : ''}
      />
    </div>
  );
}

export default App;
