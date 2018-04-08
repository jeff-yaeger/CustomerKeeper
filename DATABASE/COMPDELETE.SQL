USE [communix]
GO

/****** Object:  StoredProcedure [dbo].[Company_Delete]    Script Date: 3/30/2018 5:15:12 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


ALTER PROC [dbo].[Company_Delete]
	@Id INT
AS
/*
	declare @_id int = 1
	select * from Company where id = @_id;
	exec Company_Delete @_id;
	select * from Company where id = @_id;
*/
BEGIN TRANSACTION; 

BEGIN TRY
	DELETE Company
	WHERE Id= @Id;
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


