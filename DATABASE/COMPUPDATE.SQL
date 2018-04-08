USE [communix]
GO

/****** Object:  StoredProcedure [dbo].[Company_Update]    Script Date: 3/30/2018 5:20:32 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO




ALTER PROC [dbo].[Company_Update]
	@Id INT,
	@UserId  NVARCHAR(450),
	@CompName NVARCHAR(50),
	@FName NVARCHAR(50),
	@LName NVARCHAR(50),
	@Street NVARCHAR(40),
	@City NVARCHAR(40),
	@State NCHAR(2),
	@Zip INT,
	@Email NVARCHAR(300),
	@Phone NVARCHAR(30),
	@ModifiedBy NVARCHAR(128)
AS
/*
	declare @_id int = 1,
			@_userId  nvarchar(450) = '1234',
			@_compName nvarchar(50) = 'yes',
			@_fName nvarchar(50) = 'Fred',
			@_lName nvarchar(50) = 'Johnson',
			@_street nvarchar(40) = '1234 abc st.',
			@_city nvarchar(40) = 'maple grove', 
			@_state nchar(2) = 'CA', 
			@_zip int = '55126',
			@_email nvarchar(300) = 'jeff@jeff.com', 
			@_phone nvarchar(30) = '(949) 612-7145',
			@_modifiedBy nvarchar(128) = 'b0599793-3c48-4eab-bb48-1c4ef15a7c7c' 

		select * from Company where id = @_id;
		exec Company_Update @_id, 
								@_userId,
								@_compName,
								@_fName,
								@_lName,
								@_street, 
								@_city, 
								@_state, 
								@_zip, 
								@_email,
								@_phone,
								@_modifiedBy;

		select * from Company where id = @_id;
*/
BEGIN TRANSACTION;

BEGIN TRY
	DECLARE @_modifiedDate DATETIME = GETUTCDATE();

	UPDATE Company 
	SET
		UserId = @UserId,
		CompName = @CompName,
		FName = @FName,
		LName = @LName,
		Street = @Street,
		City = @City,
		State = @State,
		Zip = @Zip,
		Email = @Email,
		Phone = @Phone,
		ModifiedDate = @_modifiedDate,
		@ModifiedBy = @ModifiedBy
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


