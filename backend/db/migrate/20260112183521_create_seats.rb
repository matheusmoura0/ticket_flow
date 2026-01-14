class CreateSeats < ActiveRecord::Migration[8.1]
  def change
    create_table :seats do |t|
      t.references :event, null: false, foreign_key: true
      t.string :name
      t.integer :status, default: 0
      t.decimal :price

      t.timestamps
    end
  end
end
