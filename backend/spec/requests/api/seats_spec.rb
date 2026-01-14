require 'swagger_helper'

RSpec.describe 'api/seats', type: :request do
  path '/seats' do
    get 'Retrieves all seats' do
      tags 'Seats'
      produces 'application/json'

      response '200', 'seats found' do
        schema type: :array,
          items: {
            type: :object,
            properties: {
              id: { type: :integer },
              event_id: { type: :integer },
              name: { type: :string },
              status: { type: :string },
              price: { type: :number },
              created_at: { type: :string, format: :date_time },
              updated_at: { type: :string, format: :date_time }
            },
            required: [ 'id', 'event_id', 'name', 'status', 'price' ]
          }

        run_test!
      end
    end

    post 'Creates a seat' do
      tags 'Seats'
      consumes 'application/json'
      parameter name: :seat, in: :body, schema: {
        type: :object,
        properties: {
          event_id: { type: :integer },
          name: { type: :string },
          status: { type: :string },
          price: { type: :number }
        },
        required: [ 'event_id', 'name', 'status', 'price' ]
      }

      response '201', 'seat created' do
        let(:event) { Event.create(name: 'Concert', date: '2026-01-20T20:00:00Z', location: 'Stadium', total_seats: 100) }
        let(:seat) { { event_id: event.id, name: 'A1', status: 'available', price: 50.0 } }
        run_test!
      end

      response '422', 'invalid request' do
        let(:seat) { { name: 'A1' } } # Missing required params
        run_test!
      end
    end
  end

  path '/seats/{id}' do
    get 'Retrieves a seat' do
      tags 'Seats'
      produces 'application/json'
      parameter name: :id, in: :path, type: :string

      response '200', 'seat found' do
        schema type: :object,
          properties: {
            id: { type: :integer },
            event_id: { type: :integer },
            name: { type: :string },
            status: { type: :string },
            price: { type: :number },
            created_at: { type: :string, format: :date_time },
            updated_at: { type: :string, format: :date_time }
          },
          required: [ 'id', 'event_id', 'name', 'status', 'price' ]

        let(:event) { Event.create(name: 'Concert', date: '2026-01-20T20:00:00Z', location: 'Stadium', total_seats: 100) }
        let(:id) { Seat.create(event: event, name: 'A1', status: 'available', price: 50.0).id }
        run_test!
      end

      response '404', 'seat not found' do
        let(:id) { 'invalid' }
        run_test!
      end
    end

    patch 'Updates a seat' do
      tags 'Seats'
      consumes 'application/json'
      parameter name: :id, in: :path, type: :string
      parameter name: :seat, in: :body, schema: {
        type: :object,
        properties: {
          event_id: { type: :integer },
          name: { type: :string },
          status: { type: :string },
          price: { type: :number }
        }
      }

      response '200', 'seat updated' do
        let(:event) { Event.create(name: 'Concert', date: '2026-01-20T20:00:00Z', location: 'Stadium', total_seats: 100) }
        let(:id) { Seat.create(event: event, name: 'A1', status: 'available', price: 50.0).id }
        let(:seat) { { status: 'sold' } }
        run_test!
      end
    end

    delete 'Deletes a seat' do
      tags 'Seats'
      parameter name: :id, in: :path, type: :string

      response '204', 'seat deleted' do
        let(:event) { Event.create(name: 'Concert', date: '2026-01-20T20:00:00Z', location: 'Stadium', total_seats: 100) }
        let(:id) { Seat.create(event: event, name: 'A1', status: 'available', price: 50.0).id }
        run_test!
      end
    end
  end
end
