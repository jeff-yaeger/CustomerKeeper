USE [communix]
GO

/****** Object:  StoredProcedure [dbo].[EmailConfrimation_Insert]    Script Date: 3/30/2018 5:24:38 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

ALTER PROC [dbo].[EmailConfrimation_Insert]
	@Id INT OUT,
	@Email NVARCHAR(128),
	@EmailToken NVARCHAR(128)
AS
/*
	declare @_id int,
			@_email nvarchar(128) = 'testemail@email.com',
		    @_emailtoken nvarchar(128) = 'skjdflhasfh3318jslkdjflaks';

	exec EmailConfrimation_Insert @_id OUT, @_email, @_emailtoken;
	select * from EmailConfrimation where Id = @_id;
*/
BEGIN TRANSACTION;  

BEGIN TRY 
	INSERT INTO EmailConfrimation(
		Email,
		EmailToken
	) VALUES (
		@Email,
		@EmailToken
	)
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


