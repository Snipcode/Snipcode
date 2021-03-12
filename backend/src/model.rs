#[derive(Queryable, AsChangeset, Serialize, Deserialize, Debug)]
#[table_name = "Invite"]
pub struct Invite {
    pub id: Text,
    pub fromId: Nullable<Text>,
    pub takenById: Nullable<Text>,
}

#[derive(Queryable, AsChangeset, Serialize, Deserialize, Debug)]
#[table_name="Paste"]
pub struct Paste {
    pub id: Text,
    pub createdAt: Timestamp,
    pub content: Text,
    pub userId: Text,
    public: Bool,
}

#[derive(Queryable, AsChangeset, Serialize, Deserialize, Debug)]
#[table_name="User"]
pub struct User {
    pub id: Text,
    pub username: Text,
    pub password: Text
}
