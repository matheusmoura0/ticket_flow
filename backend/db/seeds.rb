# Clear existing data
Ticket.destroy_all
Seat.destroy_all
Event.destroy_all

puts "🌱 Seeding database..."

# Helper to create seats
def create_seats_for(event, rows: 10, cols: 20, price: 100)
  seats = []
  rows.times do |row_idx|
    row_char = (65 + row_idx).chr # A, B, C...
    cols.times do |col_idx|
      seat_num = col_idx + 1
      # Randomly mark some as sold for realism (10% chance)
      status = rand < 0.1 ? :sold : :available
      seats << {
        name: "#{row_char}#{seat_num}",
        price: price,
        status: status,
        row: row_char,
        column: seat_num,
        event_id: event.id
      }
    end
  end
  Seat.insert_all!(seats)
end

# 1. Coldplay
coldplay = Event.create!(
  name: "Coldplay - Music of the Spheres",
  date: "2026-10-20",
  location: "Allianz Parque",
  total_seats: 500
)
create_seats_for(coldplay, rows: 10, cols: 20, price: 300)
puts "Created Coldplay event with seats"

# 2. The Weeknd
weeknd = Event.create!(
  name: "The Weeknd - After Hours",
  date: "2026-11-15",
  location: "Morumbi",
  total_seats: 500
)
create_seats_for(weeknd, rows: 10, cols: 20, price: 250)
puts "Created The Weeknd event with seats"

# 3. Taylor Swift
taylor = Event.create!(
  name: "Taylor Swift - Eras Tour",
  date: "2026-12-05",
  location: "Engenhão",
  total_seats: 500
)
create_seats_for(taylor, rows: 10, cols: 20, price: 400)
puts "Created Taylor Swift event with seats"

puts "✅ Seeding complete!"
