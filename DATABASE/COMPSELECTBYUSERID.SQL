USE [communix]
GO

/****** Object:  StoredProcedure [dbo].[Company_Selectbyuserid]    Script Date: 3/30/2018 5:19:08 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO



ALTER PROC [dbo].[Company_Selectbyuserid]
	@UserId  NVARCHAR(450)
AS
/*
	declare
		@_id int = 1234
	exec Company_selectbyuserid @_id;
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


