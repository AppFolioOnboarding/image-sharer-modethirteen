class Image < ActiveRecord::Migration[5.2]
  def change
    create_table :images do |t|
      t.timestamps sensitivity: :low
      t.string :url, null: false
    end
  end
end
