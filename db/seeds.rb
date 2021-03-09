# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
(20..39).each do |id|
  image = Image.create(url: "https://picsum.photos/id/#{id}/400/400.jpg")
  %w[foo bar baz plugh xyzzy fred qux bazz foobar quxx].sample(3).each do |tag|
    image.tag_list.add(tag)
  end
  image.save!
end
