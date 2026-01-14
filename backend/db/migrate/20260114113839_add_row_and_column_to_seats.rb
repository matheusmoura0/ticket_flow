class AddRowAndColumnToSeats < ActiveRecord::Migration[8.1]
  def change
    add_column :seats, :row, :string
    add_column :seats, :column, :integer
  end
end
