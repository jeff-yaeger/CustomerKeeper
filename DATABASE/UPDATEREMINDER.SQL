USE [communix]
GO

/****** Object:  StoredProcedure [dbo].[Appointment_UpdateReminderSent]    Script Date: 3/30/2018 5:12:45 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO



ALTER PROC [dbo].[Appointment_UpdateReminderSent]
	@Id INT,
	@ReminderSent BIT
AS
/*
	declare @_id int = 2,
			@_reminderSent bit = 1

		exec Appointment_Selectbyid @_id;
		exec Appointment_UpdateReminderSent @_id, 
								@_reminderSent

		exec Appointment_Selectbyid @_id;
*/
BEGIN TRANSACTION;

BEGIN TRY
	UPDATE Appointment 
	SET ReminderSent = @ReminderSent
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


