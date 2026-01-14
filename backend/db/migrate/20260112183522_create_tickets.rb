class CreateTickets < ActiveRecord::Migration[8.1]
  def change
    create_table :tickets do |t|
      t.string :user_email
      t.references :seat, null: false, foreign_key: true
      t.string :payment_reference

      t.timestamps
    end
  end
end
