import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
    mutation login($email: String, $password: String) {
        login(email: $email, password: $password) {
            Auth
        }
    }
`

export const ADD_USER = gql`
    mutation addUser($email: String, $password: String, $username: String) {
        addUser(email: $email, password: $password, username: $username){
            Auth
        }
    }
`

export const SAVE_BOOK = gql`
    mutation saveBook($authors: [String], $description: String, $title: String, $bookId: ID, $image: String, $link: String) {
        saveBook(authors: [$authors], description: $description, title: $title, bookId: $bookId, image: $image, link: $link) {
            User
        }
    }
`

export const REMOVE_BOOK = gql`
    mutation removeBook($bookId: String) {
        removeBook(bookId: $bookId) {
            User
        }
    }
`