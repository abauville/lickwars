# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
# User.destroy_all
# Exercise.destroy_all
require 'open-uri'
require 'faker'
require_relative 'seed_helper'

User.destroy_all

power_users
warmup_exercise
twinkle_exercise
exercises

# Faker users ============
5.times do
  user =
    User.create(
      email: Faker::Internet.email,
      password: '123456',
      name: Faker::Name.unique.first_name
    )
  user.profile_picture.attach(
    io: URI.open('https://thispersondoesnotexist.com/image'),
    filename: "#{user.name}_profile_pic.png",
    content_type: 'image/png'
  )
end
# ========================

reviews
musics
