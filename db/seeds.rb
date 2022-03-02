# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
# User.destroy_all
# Exercise.destroy_all
require "open-uri"
require 'faker'

User.destroy_all

# == Power users =============================
tom = User.new(email: "tom@lickwars.com", password: "123456", name: "Tom")
sarah = User.new(email: "sarah@lickwars.com", password: "123456", name: "Sarah")
hiromi = User.new(email: "hiromi@lickwars.com", password: "123456", name: "Hiromi")
johann = User.new(email: "johann@lickwars.com", password: "123456", name: "Johann")
ladygogo = User.new(email: "ladygogo@lickwars.com", password: "123456", name: "LadyGogo")

# tom.profile_picture.attach(io: URI.open('https://m.media-amazon.com/images/M/MV5BMTU5M2Y5M2QtYmQ3Yi00YjBhLTgyNzEtNDhlMGNiZDRkOTgzXkEyXkFqcGdeQXVyNjc3NDgwNzU@._V1_.jpg'),
#                           filename: "Tom_profile_pic.png", content_type: 'image/png')

# sarah.profile_picture.attach(io: URI.open('http://www.anomalypodcast.com/wp-content/uploads/2016/05/Terminator_Feature1.jpg'),
#                             filename: "Sarah_profile_pic.png", content_type: 'image/png')

# hiromi.profile_picture.attach(io: URI.open('https://www.eventworld.co/blob/images/pg/hiromi-uehara_1b95b097d3_1000.jpg'),
#                              filename: "Hiromi_profile_pic.png", content_type: 'image/png')

# johann.profile_picture.attach(io: URI.open('https://www.bach-cantatas.com/thefaceofbach/Pic-FOB/1760-08-wdheq-if-300.jpg'),
#                              filename: "Johann_profile_pic.png", content_type: 'image/png')

# ladygogo.profile_picture.attach(io: URI.open('https://cdn.trendhunterstatic.com/phpthumbnails/69/69406/69406_1_600.jpeg'),
#                                filename: "LadyGogo_profile_pic.png", content_type: 'image/png')

tom.save
sarah.save
hiromi.save
johann.save
ladygogo.save
# ========================

# Faker users ============
50.times do
  user = User.create(email: Faker::Internet.email, password: "123456", name: Faker::Name.unique.first_name)
  user.profile_picture.attach(io: URI.open('https://thispersondoesnotexist.com/'),
                              filename: "#{user.name}_profile_pic.png", content_type: 'image/png')
end
# ========================

<<<<<<< HEAD
=======

# Exercises made by power users ==========================

>>>>>>> 6466c6fdec12e2cef5751d84918b6ce379b37c8c
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
# ====================================

### Music
# ===================
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
# ====================================

### Reviews
# ===================
puts "Now creating reviews:"
<<<<<<< HEAD
comments = ["Nice exercise", "good", "It's difficult", "I like this melody", "You are genius", "great practice",
            "I don't like this", "Good..", "it brings me back to childhood"]
=======
comments = ["Nice exercise", "Good", "It was difficult",
            "I like this melody", "You are a genius", "Great practice",
            "It brings me back to my childhood", "The third bar was really tricky",
            "The end has nice twist!", "Very Mozartian!", "Man, that #11 was spicy!",
            "Nice melody, not too hard", "A bit too easy", "Classical harmony with a twist",
            "Can't get wrong with those chords", "That melody was just classic (in a jazzy way)",
            "Good drills", "Now, I realize I need to practice more those basic progressions",
            "The final suspension was the cherry on the cake", "It started easy and then... are you insane!",
            "Just what you would expect", "Does the job", "Perfect drill during my commute",
            "Just the exercise I needed", "I always find it difficult to distinguish 4 and 2. This series of exercise is really what I needed",
            "That melody! I almost cried.", "I need more of those", "Meeeeh...", "It didn't disappoint",
            "Vibes of Chopin anyone?", "I see someone likes Bach", "Popping and hopping!", "It pumped me up"]
>>>>>>> 6466c6fdec12e2cef5751d84918b6ce379b37c8c
Exercise.all.each do |exercise|
  users = User.all.reject { |usr| usr == exercise.user }.sample(rand(3..15))
  users.each do |user|
    Review.create(
      exercise: exercise,
      user: user,
      content: comments.sample,
      vote: rand(0..1)
    )
  end
end
# ====================================
