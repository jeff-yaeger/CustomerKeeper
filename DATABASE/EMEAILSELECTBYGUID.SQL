USE [communix]
GO

/****** Object:  StoredProcedure [dbo].[EmailConfrimation_SelectByEToken]    Script Date: 3/30/2018 5:26:22 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


  ALTER PROC [dbo].[EmailConfrimation_SelectByEToken]
	@EmailToken NVARCHAR(128)
as
/*
	declare @_emailtoken nvarchar(128) = '4CFC9465-1A6E-45F8-92A1-F1A634A89496'
	
	exec [EmailConfrimation_SelectByEToken] @_emailtoken;
	
	select * from EmailConfrimation where EmailToken = @_emailToken;
*/
BEGIN TRY
	SELECT Email
	FROM EmailConfrimation
	WHERE EmailToken = @EmailToken
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


