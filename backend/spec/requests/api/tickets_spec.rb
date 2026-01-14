require 'swagger_helper'

RSpec.describe 'api/tickets', type: :request do
  path '/tickets' do
    post 'Creates a ticket' do
      tags 'Tickets'
      consumes 'application/json'
      parameter name: :ticket, in: :body, schema: {
        type: :object,
        properties: {
          seat_id: { type: :integer },
          user_email: { type: :string }
        },
        required: [ 'seat_id', 'user_email' ]
      }

      response '201', 'ticket created' do
        let(:event) { Event.create(name: 'Concert', date: '2026-01-20T20:00:00Z', location: 'Stadium', total_seats: 100) }
        let(:seat) { Seat.create(event: event, name: 'A1', status: 'available', price: 50.0) }
        let(:ticket) { { seat_id: seat.id, user_email: 'test@example.com' } }
        run_test!
      end

      response '422', 'unprocessable entity' do
        let(:event) { Event.create(name: 'Concert', date: '2026-01-20T20:00:00Z', location: 'Stadium', total_seats: 100) }
        let(:seat) { Seat.create(event: event, name: 'A1', status: 'sold', price: 50.0) }
        let(:ticket) { { seat_id: seat.id, user_email: 'test@example.com' } }
        run_test!
      end

      response '404', 'seat not found' do
        let(:ticket) { { seat_id: 99999, user_email: 'test@example.com' } }
        run_test!
      end
    end
  end
end
