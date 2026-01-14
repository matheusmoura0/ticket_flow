Event.destroy_all
Seat.destroy_all
Ticket.destroy_all

event = Event.create!(
  name: "Rock in Rio 2026",
  date: 1.year.from_now,
  location: "Rio de Janeiro",
  total_seats: 50
)

rows = ['A', 'B', 'C', 'D', 'E']
cols = 10

rows.each do |row|
  (1..cols).each do |col|
    Seat.create!(
      event: event,
      name: "#{row}#{col}",
      status: :available,
      price: rand(100..300)
    )
  end
end

puts "Seeded #{Event.count} events and #{Seat.count} seats."
