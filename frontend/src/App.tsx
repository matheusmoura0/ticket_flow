import { useState } from 'react';
import { EventList } from './components/EventList';
import { SeatMap } from './components/SeatMap';

function App() {
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 border-b pb-4">
          <h1 className="text-3xl font-bold text-blue-600">TicketFlow</h1>
          <p className="text-gray-600">High-concurrency ticket sales demo</p>
        </header>

        <main className="grid md:grid-cols-[300px_1fr] gap-8">
          <aside className="bg-white p-6 rounded-lg shadow-sm h-fit">
            <EventList
              onSelectEvent={setSelectedEventId}
              selectedEventId={selectedEventId}
            />
          </aside>

          <section className="bg-white p-6 rounded-lg shadow-sm min-h-[400px]">
            {selectedEventId ? (
              <SeatMap eventId={selectedEventId} />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                Select an event to view seats
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

export default App;
