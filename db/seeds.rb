# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
# User.destroy_all
# Exercise.destroy_all
User.destroy_all
User.create(email: "tom@lickwars.com", password: "123456", name: "Tom")
sarah = User.create(email: "sarah@lickwars.com", password: "123456", name: "Sarah")
hiromi = User.create(email: "hiromi@lickwars.com", password: "123456", name: "Hiromi")
johann = User.create(email: "johann@lickwars.com", password: "123456", name: "Johann")
ladygogo = User.create(email: "ladygogo@lickwars.com", password: "123456", name: "LadyGogo")


# Exercise.new(
#   difficulty: rand(0.0..10.0),
#   name: "Exploring the I - V relation ##{1}",
#   description: "The I and V chords are the fundamental building blocks of western tonal music. In this series of exercise we train to recognize and understand their usage.",
#   chord_progression: "I - V - I",
#   user: sarah
# )

11.times do |i_exercise|
  Exercise.create(
    difficulty: rand(0.0..10.0),
    name: "Exploring the I - V relation ##{i_exercise + 1}",
    description: "The I and V chords are the fundamental building blocks of western tonal music. In this series of exercise we train to recognize and understand their usage.",
    chord_progression: "I - V - I",
    user: sarah
  )
end

8.times do |i_exercise|
  Exercise.create(
    difficulty: rand(0.0..10.0),
    name: "Easy licks ##{i_exercise + 1}",
    description: "The ii7 - V7 - IΔ7 (or 2-5-1) progression is the building block of jazz",
    chord_progression: "ii7 - V7 - IΔ7",
    user: hiromi
  )

end

progs = ["I - IV", "I - V", "I - V -", "I - IV - I", "I - IV -V - I", "I - V - IV - I"]
15.times do |i_exercise|
  Exercise.create(
    difficulty: rand(0.0..10.0),
    name: "IV vs V chords ##{i_exercise + 1}",
    description: "Learn to recognize melodies using the IV or V chords",
    chord_progression: progs.sample,
    user: johann
  )
end

progs = ["vi - IV - I - V"]

12.times do |i_exercise|
  Exercise.create(
    difficulty: rand(0.0..10.0),
    name: "Get pop! ##{i_exercise + 1}",
    description: "The vi - IV - I - V is used in about 80% of the hit pop songs for the last 20 years",
    chord_progression: progs.sample,
    user: ladygogo
  )
end

Music.create(
  bpm: 80,
  key_signature: 2,
  notes: "C D E G",
  note_values: "4 4 4 4",
  chords: "C",
  chord_values: "1",
  user: sarah,
  is_question: true,
  status: 0,
  exercise: Exercise.first
)
