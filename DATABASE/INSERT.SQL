USE [communix]
GO

/****** Object:  StoredProcedure [dbo].[Appointment_Insert]    Script Date: 3/30/2018 4:55:58 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO






ALTER PROC [dbo].[Appointment_Insert]

	@Id int OUT,
	@UserId  nvarchar(450),
	@CustFName nvarchar(50),
	@CustLName nvarchar(50),
	@Street nvarchar(40),
	@City nvarchar(40),
	@State nchar(2),
	@Zip int,
	@Email nvarchar(300),
	@Phone nvarchar(30),
	@Appoint datetime,
	@ModifiedBy nvarchar(128),
	@IsCnfrmed bit,
	@ReminderSent bit,
	@CompName nvarchar(50),
    @CompEmail nvarchar(300)
AS
/*
	declare @_id int,
			@_userId  nvarchar(450) = 'a1be02bb-3943-4c31-b21d-d002ea0642ce',
			@_custFName nvarchar(50) = 'Fred',
			@_custLName nvarchar(50) = 'Johnson',
			@_street nvarchar(40) = '1234 abc st.',
			@_city nvarchar(40) = 'maple grove', 
			@_state nchar(2) = 'MN', 
			@_zip int = '55126',
			@_email nvarchar(300) = 'jeff@jeff.com', 
			@_phone nvarchar(30) = '(949) 612-7145',
			@_appoint datetime = '2018-12-12',
			@_modifiedBy nvarchar(128) = 'b0599793-3c48-4eab-bb48-1c4ef15a7c7c', 
			@_isCnfrmed bit = 0,
			@_reminderSent bit = 0,
			@_compName nvarchar(50) = 'Awesome',
			@_compEmail nvarchar(300) = 'jeff@jeff.com' 

			EXECUTE Appointment_Insert
			@_id OUT,
			@_userId,
			@_custFName,
			@_custLName,
			@_street,
			@_city,
			@_state,
			@_zip,
			@_email,
			@_phone,
			@_appoint,
			@_modifiedBy,
			@_isCnfrmed,
			@_reminderSent,
			@_compName,
			@_compEmail;

			select @_id
			select * from Appointment where id = @_id;
*/
BEGIN TRANSACTION;

BEGIN TRY
	INSERT INTO Appointment(
		UserId,
		CustFName,
		CustLName,
		Street,
		City,
		State,
		Zip,
		Email,
		Phone,
		Appoint,
		ModifiedBy,
		IsCnfrmed,
		ReminderSent,
		CompName,
		CompEmail
		)values(
		@UserId,
		@CustFName,
		@CustLName,
		@Street,
		@City,
		@State,
		@Zip,
		@Email,
		@Phone,
		@Appoint,
		@ModifiedBy,
		@IsCnfrmed,
		@ReminderSent,
		@CompName,
		@CompEmail
		);
	SET @Id = SCOPE_IDENTITY();
END TRY  
BEGIN CATCH  
    SELECT   
        ERROR_NUMBER() AS ErrorNumber  
        ,ERROR_SEVERITY() AS ErrorSeverity  
        ,ERROR_STATE() AS ErrorState  
        ,ERROR_PROCEDURE() AS ErrorProcedure  
        ,ERROR_LINE() AS ErrorLine  
        ,ERROR_MESSAGE() AS ErrorMessage;  

    IF @@TRANCOUNT > 0  
        ROLLBACK TRANSACTION;  
END CATCH;  

IF @@TRANCOUNT > 0  
    COMMIT TRANSACTION;  
GO  


