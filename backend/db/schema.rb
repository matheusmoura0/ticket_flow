# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2026_01_14_113839) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "events", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "date"
    t.string "location"
    t.string "name"
    t.integer "total_seats"
    t.datetime "updated_at", null: false
  end

  create_table "seats", force: :cascade do |t|
    t.integer "column"
    t.datetime "created_at", null: false
    t.bigint "event_id", null: false
    t.string "name"
    t.decimal "price"
    t.string "row"
    t.integer "status", default: 0
    t.datetime "updated_at", null: false
    t.index ["event_id"], name: "index_seats_on_event_id"
  end

  create_table "tickets", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "payment_reference"
    t.bigint "seat_id", null: false
    t.datetime "updated_at", null: false
    t.string "user_email"
    t.index ["seat_id"], name: "index_tickets_on_seat_id"
  end

  add_foreign_key "seats", "events"
  add_foreign_key "tickets", "seats"
end
