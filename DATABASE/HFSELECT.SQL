USE [communix]
GO

/****** Object:  StoredProcedure [dbo].[Appointment_HFSelectAll]    Script Date: 3/30/2018 4:37:49 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO






ALTER PROC [dbo].[Appointment_HFSelectAll]
AS
/*
exec Appointment_HFSelectAll
*/
BEGIN TRY
	DECLARE @currDate DATETIME = SYSDATETIMEOFFSET(),
			@tomorrow DATETIME = DATEADD(HOUR, 38, SYSDATETIMEOFFSET());
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
	WHERE @currDate < Appoint and @tomorrow > Appoint and ReminderSent = 0;
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


