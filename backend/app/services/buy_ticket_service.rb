class BuyTicketService
  class SeatSoldError < StandardError; end

  def initialize(seat_id:, user_email:)
    @seat_id = seat_id
    @user_email = user_email
  end

  def call
    Seat.transaction do
      # Pessimistic locking
      seat = Seat.lock("FOR UPDATE").find(@seat_id)

      if seat.sold?
        raise SeatSoldError, "Seat already sold"
      end

      # Create ticket
      ticket = Ticket.create!(
        seat: seat, 
        user_email: @user_email, 
        payment_reference: "PAY_#{SecureRandom.hex(8).upcase}"
      )
      
      # Mark seat as sold
      seat.sold!
      
      ticket
    end
  rescue ActiveRecord::RecordNotFound
    raise ActiveRecord::RecordNotFound, "Seat not found"
  end
end
