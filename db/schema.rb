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

ActiveRecord::Schema.define(version: 2022_03_01_063158) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "exercises", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "music_id", null: false
    t.float "difficulty"
    t.string "name", null: false
    t.text "description", default: "", null: false
    t.string "chord_progression", default: "", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["music_id"], name: "index_exercises_on_music_id"
    t.index ["user_id"], name: "index_exercises_on_user_id"
  end

  create_table "musics", force: :cascade do |t|
    t.integer "bpm", default: 80, null: false
    t.integer "key_signature", default: 0, null: false
    t.integer "mode", default: 0, null: false
    t.string "notes", default: "", null: false
    t.string "chords", default: "", null: false
    t.string "note_values", default: "", null: false
    t.string "chord_values", default: "", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.bigint "user_id", null: false
    t.bigint "exercise_id", null: false
    t.boolean "is_question", default: false, null: false
    t.integer "status", default: 0, null: false
    t.index ["exercise_id"], name: "index_musics_on_exercise_id"
    t.index ["user_id"], name: "index_musics_on_user_id"
  end

  create_table "reviews", force: :cascade do |t|
    t.bigint "exercise_id", null: false
    t.bigint "user_id", null: false
    t.text "content"
    t.integer "vote", default: 1, null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["exercise_id"], name: "index_reviews_on_exercise_id"
    t.index ["user_id"], name: "index_reviews_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "name", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  add_foreign_key "exercises", "users"
  add_foreign_key "musics", "exercises"
  add_foreign_key "musics", "users"
  add_foreign_key "reviews", "exercises"
  add_foreign_key "reviews", "users"
end
