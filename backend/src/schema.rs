table! {
    Invite (id) {
        id -> Text,
        fromId -> Nullable<Text>,
        takenById -> Nullable<Text>,
    }
}

table! {
    Paste (id) {
        id -> Text,
        createdAt -> Timestamp,
        content -> Text,
        userId -> Text,
        public -> Bool,
    }
}

table! {
    User (id) {
        id -> Text,
        username -> Text,
        password -> Text,
    }
}

table! {
    _prisma_migrations (id) {
        id -> Text,
        checksum -> Text,
        finished_at -> Nullable<Timestamp>,
        migration_name -> Text,
        logs -> Nullable<Text>,
        rolled_back_at -> Nullable<Timestamp>,
        started_at -> Timestamp,
        applied_steps_count -> Integer,
    }
}

joinable!(Paste -> User (userId));

allow_tables_to_appear_in_same_query!(
    Invite,
    Paste,
    User,
    _prisma_migrations,
);
