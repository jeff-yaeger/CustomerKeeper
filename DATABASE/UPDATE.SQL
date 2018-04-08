USE [communix]
GO

/****** Object:  StoredProcedure [dbo].[Appointment_Update]    Script Date: 3/30/2018 5:09:51 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO



CREATE PROC [dbo].[Appointment_Update]
	@Id INT,
	@UserId  NVARCHAR(450),
	@CustFName NVARCHAR(50),
	@CustLName NVARCHAR(50),
	@Street NVARCHAR(40),
	@City NVARCHAR(40),
	@State NCHAR(2),
	@Zip INT,
	@Email NVARCHAR(300),
	@Phone NVARCHAR(30),
	@Appoint DATETIME,
	@ModifiedBy NVARCHAR(128),
	@IsCnfrmed BIT,
	@ReminderSent BIT,
	@CompName NVARCHAR(50),
	@CompEmail NVARCHAR(300)
AS
/*
	declare @_id int = 7,
			@_userId  nvarchar(450) = 'a1be02bb-3943-4c31-b21d-d002ea0642ce',
			@_custFName nvarchar(50) = 'Fred',
			@_custLName nvarchar(50) = 'Johnson',
			@_street nvarchar(40) = '1234 abc st.',
			@_city nvarchar(40) = 'maple grove', 
			@_state nchar(2) = 'CA', 
			@_zip int = '55126',
			@_email nvarchar(300) = 'caladinsere@gmail.com', 
			@_phone nvarchar(30) = '(949) 612-7145',
			@_appoint datetime = '2018-03-21 17:00',
			@_modifiedBy nvarchar(128) = 'b0599793-3c48-4eab-bb48-1c4ef15a7c7c' ,
			@_isCnfrmed bit = 0,
			@_reminderSent bit = 0,
			@_compName nvarchar(50) = 'copy Aweseome',
			@_compEmail nvarchar(300) = 'theocfinalfinish@gmail.com'

		exec Appointment_Selectbyid @_id;
		exec Appointment_Update @_id, 
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
								@_compEmail

		exec Appointment_Selectbyid @_id;
*/
BEGIN TRANSACTION;

BEGIN TRY
	DECLARE @_modifiedDate DATETIME = GETUTCDATE();

	UPDATE Appointment 
		SET
			UserId = @UserId,
			CustFName = @CustFName,
			CustLName = @CustLName,
			Street = @Street,
			City = @City,
			State = @State,
			Zip = @Zip,
			Email = @Email,
			Phone = @Phone,
			Appoint = @Appoint,
			ModifiedDate = @_modifiedDate,
			ModifiedBy = @ModifiedBy,
			IsCnfrmed = @IsCnfrmed,
			ReminderSent  = @ReminderSent,
			CompName = @CompName,
			CompEmail = @CompEmail 
	WHERE Id = @Id
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


