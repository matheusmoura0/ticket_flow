class SeatsController < ApplicationController
  before_action :set_seat, only: %i[ show update destroy ]

  # GET /seats
  def index
    @seats = Seat.all

    render json: @seats
  end

  # GET /seats/1
  def show
    render json: @seat
  end

  # POST /seats
  def create
    @seat = Seat.new(seat_params)

    if @seat.save
      render json: @seat, status: :created, location: @seat
    else
      render json: @seat.errors, status: :unprocessable_content
    end
  end

  # PATCH/PUT /seats/1
  def update
    if @seat.update(seat_params)
      render json: @seat
    else
      render json: @seat.errors, status: :unprocessable_content
    end
  end

  # DELETE /seats/1
  def destroy
    @seat.destroy!
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_seat
      @seat = Seat.find(params.expect(:id))
    end

    # Only allow a list of trusted parameters through.
    def seat_params
      params.expect(seat: [ :event_id, :name, :status, :price ])
    end
end
