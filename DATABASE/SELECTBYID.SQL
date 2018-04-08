USE [communix]
GO

/****** Object:  StoredProcedure [dbo].[Appointment_Selectbyid]    Script Date: 3/30/2018 5:01:23 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO




ALTER PROC [dbo].[Appointment_Selectbyid]
	@Id int
AS
/*
	declare
		@_id int = 7
	exec Appointment_Selectbyid @_id;
*/

BEGIN TRY
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
	WHERE Id=@id;
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

