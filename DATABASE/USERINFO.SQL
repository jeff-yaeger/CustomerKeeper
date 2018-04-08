USE [communix]
GO

/****** Object:  StoredProcedure [dbo].[User_SelectAll]    Script Date: 3/30/2018 5:29:02 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

ALTER PROC [dbo].[User_SelectAll]
 @UserId NVARCHAR(450)
as
/*

*/
BEGIN TRY
	SELECT
		Id,
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
		CreatedDate,
		ModifiedDate,
		ModifiedBy
	FROM Company
	WHERE UserId=@userId;
	SELECT
		Id,
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
		CreatedDate,
		ModifiedDate,
		ModifiedBy,
		IsCnfrmed,
		ReminderSent,
		CompName,
		CompEmail
	FROM Appointment
	WHERE UserId=@userId 
END TRY  
BEGIN CATCH  
    SELECT  
        ERROR_NUMBER() AS ErrorNumber  
        ,ERROR_SEVERITY() AS ErrorSeverity  
        ,ERROR_STATE() AS ErrorState  
        ,ERROR_PROCEDURE() AS ErrorProcedure  
        ,ERROR_LINE() AS ErrorLine  
        ,ERROR_MESSAGE() AS ErrorMessage;  
END CATCH;  
GO  


