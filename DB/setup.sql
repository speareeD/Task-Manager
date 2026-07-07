IF NOT EXISTS (
    SELECT 1
    FROM dbo.Users
    WHERE email = 'admin@example.com'
)
BEGIN
    INSERT INTO dbo.Users
    (
        [name],
        [email],
        [passwordHash],
        [salt],
        [isAdmin],
        [createdAt],
        [isActive]
    )
    VALUES
    (
        'Administrator',
        'admin@example.com',
        '$2a$11$30.xy5AZynLsdva7c3PWi.zNwlh5Y3PnIV3wig2YOleZx3robv6mC',
        '3daea4a8-0',
        1,
        GETUTCDATE(),
        1
    );
END
