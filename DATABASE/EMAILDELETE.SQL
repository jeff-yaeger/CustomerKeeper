USE [communix]
GO

/****** Object:  StoredProcedure [dbo].[EmailConfrimation_Delete]    Script Date: 3/30/2018 5:23:01 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

ALTER PROC [dbo].[EmailConfrimation_Delete]
	@Id INT
as
/*
	declare @_id int = 2;
	select * from EmailConfrimation where Id = @_id;
	exec [EmailConfrimation_Delete] @_id;
	select * from EmailConfrimation where Id = @_id;
*/
BEGIN TRANSACTION;  

BEGIN TRY  
	DELETE FROM EmailConfrimation 
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


