class CreateShops < ActiveRecord::Migration[5.2]
  def change
    create_table :shops do |t|
      t.string :name
      t.string :url
      t.string :image_url
      t.string :opentime
      t.references :user, foreign_key: true

      t.timestamps
    end
  end
end
