USE [communix]
GO

/****** Object:  StoredProcedure [dbo].[Appointment_Selectbyuserid]    Script Date: 3/31/2018 8:08:53 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO







ALTER PROC [dbo].[Appointment_Selectbyuserid]
	@PageSize INT = 20,
	@PageNum INT = 1,
	@SortDir VARCHAR(4) = 'ASC',
	@SortCol VARCHAR(4) = 'Id',
	@UserId  NVARCHAR(450),
	@CustFNameFilter NVARCHAR(50) = NULL,
	@CustLNameFilter NVARCHAR(50) = NULL,
	@AppointFilter DATETIME = NULL

AS
/*
	declare @_pageSize int = 40,
			@_pageNum int = 1,
			@_sortDir varchar(4) = 'ASC',
			@_sortCol varchar(4) = 'Id',
			@_userId nvarchar(450) = a1be02bb-3943-4c31-b21d-d002ea0642ce,
			@_custFNameFilter nvarchar(50) = null,
			@_custLNameFilter nvarchar(50) = null,
			@_appointFilter DATETIME = null
	exec Appointment_Selectbyuserid @_pageSize 
									,@_pageNum 
									,@_sortDir 
									,@_sortCol  
									,@_userId
									,@_custFNameFilter
									,@_custLNameFilter
									,@_appointFilter

*/

BEGIN TRY
	DECLARE @currDate DATETIME = SYSDATETIMEOFFSET();
	; WITH CTE_Results AS
	(
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
	WHERE UserId=@userId AND @currDate < Appoint AND
	(CustFName like '%' + @CustFNameFilter + '%' or @CustFNameFilter IS NULL) and
	(CustLName like '%' + @CustLNameFilter + '%' or @CustLNameFilter IS NULL) and
	(Appoint = @AppointFilter or @AppointFilter IS NULL)
	ORDER BY 
		CASE WHEN @SortDir = 'ASC' THEN
			CASE @SortCol
				WHEN 'Id' THEN Id
				WHEN 'UserId' THEN UserId
				WHEN 'CustFName' THEN CustFName
				WHEN 'CustLName' THEN CustLName
				WHEN 'Street' THEN Street
				WHEN 'City' THEN City
				WHEN 'State' THEN State
				WHEN 'Zip' THEN Zip
				WHEN 'Email' THEN Email
				WHEN 'Phone' THEN Phone
				WHEN 'Appoint' THEN Appoint
				WHEN 'CreatedDate' THEN CreatedDate
				WHEN 'ModifiedDate' THEN ModifiedDate
				WHEN 'ModifiedBy' THEN ModifiedBy
				WHEN 'IsCnfrmed' THEN IsCnfrmed
				WHEN 'ReminderSent' THEN ReminderSent
				WHEN 'CompName' THEN CompName
				WHEN 'CompEmail' THEN CompEmail
			END
		END ASC,
		CASE WHEN @SortDir = 'DESC' THEN
			CASE @SortCol
				WHEN 'Id' THEN Id
				WHEN 'UserId' THEN UserId
				WHEN 'CustFName' THEN CustFName
				WHEN 'CustLName' THEN CustLName
				WHEN 'Street' THEN Street
				WHEN 'City' THEN City
				WHEN 'State' THEN State
				WHEN 'Zip' THEN Zip
				WHEN 'Email' THEN Email
				WHEN 'Phone' THEN Phone
				WHEN 'Appoint' THEN Appoint
				WHEN 'CreatedDate' THEN CreatedDate
				WHEN 'ModifiedDate' THEN ModifiedDate
				WHEN 'ModifiedBy' THEN ModifiedBy
				WHEN 'IsCnfrmed' THEN IsCnfrmed
				WHEN 'ReminderSent' THEN ReminderSent
				WHEN 'CompName' THEN CompName
				WHEN 'CompEmail' THEN CompEmail
			END
		END DESC
	OFFSET @PageSize * (@PageNum - 1) ROWS
	FETCH NEXT @PageSize ROWS ONLY
	)
	Select 
		a.Id,
		a.UserId,
		a.CustFName,
		a.CustLName,
		a.Street,
		a.City,
		a.State,
		a.Zip,
		a.Email,
		a.Phone,
		a.Appoint,
		a.CreatedDate,
		a.ModifiedDate,
		a.ModifiedBy,
		a.IsCnfrmed,
		a.ReminderSent,
		a.CompName,
		a.CompEmail
	
		FROM Appointment AS a
	WHERE exists(SELECT 1 FROM cte_results WHERE cte_results.Id = a.Id)
	OPTION (RECOMPILE)

	select count(1) from Appointment
		where
		(CustFName like '%' + @CustFNameFilter + '%' or @CustFNameFilter IS NULL) and
		(CustLName like '%' + @CustLNameFilter + '%' or @CustLNameFilter IS NULL) and
		(Appoint = @AppointFilter or @AppointFilter IS NULL)
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




