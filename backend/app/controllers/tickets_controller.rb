class TicketsController < ApplicationController
  # POST /tickets
  def create
    service = BuyTicketService.new(
      seat_id: ticket_params[:seat_id],
      user_email: ticket_params[:user_email]
    )

    ticket = service.call
    render json: ticket, status: :created
  rescue BuyTicketService::SeatSoldError => e
    render json: { error: e.message }, status: :unprocessable_entity
  rescue ActiveRecord::RecordNotFound => e
    render json: { error: "Seat not found" }, status: :not_found
  rescue StandardError => e
    render json: { error: e.message }, status: :internal_server_error
  end

  private

    def ticket_params
      params.require(:ticket).permit(:seat_id, :user_email)
    end
end
