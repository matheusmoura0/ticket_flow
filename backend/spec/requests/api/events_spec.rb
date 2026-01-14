require 'swagger_helper'

RSpec.describe 'api/events', type: :request do
  path '/events' do
    get 'Retrieves all events' do
      tags 'Events'
      produces 'application/json'

      response '200', 'events found' do
        schema type: :array,
          items: {
            type: :object,
            properties: {
              id: { type: :integer },
              name: { type: :string },
              date: { type: :string, format: :date_time },
              location: { type: :string },
              total_seats: { type: :integer },
              created_at: { type: :string, format: :date_time },
              updated_at: { type: :string, format: :date_time }
            },
            required: [ 'id', 'name', 'date', 'location', 'total_seats' ]
          }

        run_test!
      end
    end

    post 'Creates an event' do
      tags 'Events'
      consumes 'application/json'
      parameter name: :event, in: :body, schema: {
        type: :object,
        properties: {
          name: { type: :string },
          date: { type: :string, format: :date_time },
          location: { type: :string },
          total_seats: { type: :integer }
        },
        required: [ 'name', 'date', 'location', 'total_seats' ]
      }

      response '201', 'event created' do
        let(:event) { { name: 'Concert', date: '2026-01-20T20:00:00Z', location: 'Stadium', total_seats: 100 } }
        run_test!
      end

      response '422', 'invalid request' do
        let(:event) { { name: 'Concert' } } # Missing required params
        run_test!
      end
    end
  end

  path '/events/{id}' do
    get 'Retrieves an event' do
      tags 'Events'
      produces 'application/json'
      parameter name: :id, in: :path, type: :string

      response '200', 'event found' do
        schema type: :object,
          properties: {
            id: { type: :integer },
            name: { type: :string },
            date: { type: :string, format: :date_time },
            location: { type: :string },
            total_seats: { type: :integer },
            created_at: { type: :string, format: :date_time },
            updated_at: { type: :string, format: :date_time }
          },
          required: [ 'id', 'name', 'date', 'location', 'total_seats' ]

        let(:id) { Event.create(name: 'Concert', date: '2026-01-20T20:00:00Z', location: 'Stadium', total_seats: 100).id }
        run_test!
      end

      response '404', 'event not found' do
        let(:id) { 'invalid' }
        run_test!
      end
    end

    patch 'Updates an event' do
      tags 'Events'
      consumes 'application/json'
      parameter name: :id, in: :path, type: :string
      parameter name: :event, in: :body, schema: {
        type: :object,
        properties: {
          name: { type: :string },
          date: { type: :string, format: :date_time },
          location: { type: :string },
          total_seats: { type: :integer }
        }
      }

      response '200', 'event updated' do
        let(:id) { Event.create(name: 'Concert', date: '2026-01-20T20:00:00Z', location: 'Stadium', total_seats: 100).id }
        let(:event) { { name: 'Updated Concert' } }
        run_test!
      end
    end

    delete 'Deletes an event' do
      tags 'Events'
      parameter name: :id, in: :path, type: :string

      response '204', 'event deleted' do
        let(:id) { Event.create(name: 'Concert', date: '2026-01-20T20:00:00Z', location: 'Stadium', total_seats: 100).id }
        run_test!
      end
    end
  end
end
