class Seat < ApplicationRecord
  belongs_to :event
  enum :status, { available: 0, sold: 1, locked: 2 }
  validates :name, presence: true
end
