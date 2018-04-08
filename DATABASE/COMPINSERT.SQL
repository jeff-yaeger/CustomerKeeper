USE [communix]
GO

/****** Object:  StoredProcedure [dbo].[Company_Insert]    Script Date: 3/30/2018 5:17:06 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO



ALTER PROC [dbo].[Company_Insert]

	@Id INT OUT,
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
	declare @_id int,
			@_userId  nvarchar(450) = '1234',
			@_compName nvarchar(50) = 'stupid',
			@_fName nvarchar(50) = 'Fred',
			@_lName nvarchar(50) = 'Johnson',
			@_street nvarchar(40) = '1234 abc st.',
			@_city nvarchar(40) = 'maple grove', 
			@_state nchar(2) = 'MN', 
			@_zip int = '55126',
			@_email nvarchar(300) = 'jeff@jeff.com', 
			@_phone nvarchar(30) = '(949) 612-7145',
			@_modifiedBy nvarchar(128) = 'b0599793-3c48-4eab-bb48-1c4ef15a7c7c' 

			EXECUTE Company_Insert
			@_id OUT,
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

			select @_id
			select * from Company where id = @_id;
*/
BEGIN TRANSACTION;

BEGIN TRY
	INSERT INTO Company(
		UserId,
		CompName,
		FName,
		LName,
		Street,
		City,
		State,
		Zip,
		Email,
		Phone,
		ModifiedBy
		)values(
		@UserId,
		@CompName,
		@FName,
		@LName,
		@Street,
		@City,
		@State,
		@Zip,
		@Email,
		@Phone,
		@ModifiedBy
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

