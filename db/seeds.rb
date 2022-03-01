# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
Users.destroy_all
Exercises.destroy_all

series_name = ["Exploring the I - V relation",
               "Melodies on 2-5-1",]

user = User.create(email: "sarah@lickwars.com", password: 123456)
11.times do |i_exercise|
  exercise = Exercise.new(
    difficulty: rand(0.0..10.0),
    name: "Exploring the I - V relation ##{i_exercise + 1}",
    description: "The I and V chords are the fundamental building blocks of western tonal music. In this series of exercise we train to recognize and understand their usage.",
    chord_progression: "I - V - I"
  )
end

user = User.create(email: "kimiko@lickwars.com", password: 123456)
8.times do |i_exercise|
  exercise = Exercise.new(
    difficulty: rand(0.0..10.0),
    name: "Easy licks ##{i_exercise + 1}",
    description: "The ii7 - V7 - IΔ7 (or 2-5-1) progression is the building block of jazz",
    chord_progression: "ii7 - V7 - IΔ7"
  )
end

progs = ["I - IV", "I - V", "I - V -", "I - IV - I", "I - IV -V - I", "I - V - IV - I"]
user = User.create(email: "johann@lickwars.com", password: 123456)
15.times do |i_exercise|
  exercise = Exercise.new(
    difficulty: rand(0.0..10.0),
    name: "IV vs V chords ##{i_exercise + 1}",
    description: "Learn to recognize melodies using the IV or V chords",
    chord_progression: progs.sample
  )
end

progs = ["vi - IV - I - V"]
user = User.create(email: "ladygogo@lickwars.com", password: 123456)
12.times do |i_exercise|
  exercise = Exercise.new(
    difficulty: rand(0.0..10.0),
    name: "Get pop! ##{i_exercise + 1}",
    description: "The vi - IV - I - V is used in about 80% of the hit pop songs for the last 20 years",
    chord_progression: progs.sample
  )
end


n = 10
n.times do |i_user|
  puts "User #{i_user}/#{n}"
  user = User.create(email: Faker::Internet.email, password: 123456)

  rand(5..15).times do |i_exercise|
    exercise = Exercise.new(
      difficulty: rand(0.0..10.0),
      difficulty: rand(0.0..10.0),
    )
  end
end
