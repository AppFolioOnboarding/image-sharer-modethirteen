class Image < ActiveRecord::Migration[5.2]
  def change

    # TODO (andy.vaughn, 20210228): add an index to created_at timestamp as it's used to fetch previous/next records
    create_table :images do |t|
      t.timestamps sensitivity: :low
      t.string :url, null: false
    end
  end
end
